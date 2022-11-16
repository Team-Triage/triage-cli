const path = require('path')
const { Stack, StackProps, CfnOutput, RemovalPolicy } = require("aws-cdk-lib");
const { DockerImageAsset } = require('aws-cdk-lib/aws-ecr-assets');
const { GatewayVpcEndpointAwsService, Vpc} = require("aws-cdk-lib/aws-ec2");
const { AnyPrincipal, Effect, PolicyStatement } = require("aws-cdk-lib/aws-iam");

const ecs = require("aws-cdk-lib/aws-ecs");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const ecs_patterns = require("aws-cdk-lib/aws-ecs-patterns");



class TriageServiceStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const TOPIC_NAME = process.env.TOPIC_NAME
    const PARTITION_COUNT = +process.env.PARTITION_COUNT
    const DEAD_LETTER_TABLE_NAME = `TriageDeadLetters${TOPIC_NAME}`


    const asset = new DockerImageAsset(this, `Triage${TOPIC_NAME}Image`, {
      directory: path.join(__dirname, '../../src'),
    })

    const vpc = new Vpc(this, `Triage${TOPIC_NAME}VPC`, {
      maxAzs: 2 // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, `Triage${TOPIC_NAME}Cluster`, {
      vpc: vpc
    });

    const dynamoTable = new dynamodb.Table(this, DEAD_LETTER_TABLE_NAME, { 
      tableName: DEAD_LETTER_TABLE_NAME,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Should support surge in poison pills
      removalPolicy: RemovalPolicy.DESTROY,
      tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS,
      pointInTimeRecovery: true,
      partitionKey: { name: "UUID", type: dynamodb.AttributeType.STRING },
      sortKey: {name: "TIMESTAMP", type: dynamodb.AttributeType.STRING},
    });

    // Create a load-balanced Fargate service and make it public
    const TriageFargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, `Triage${TOPIC_NAME}FargateService`, {
      cluster: cluster, // Required
      cpu: 256, // Default is 256
      desiredCount: PARTITION_COUNT, // Default is 1
      taskImageOptions: {
        containerName: `triage${TOPIC_NAME}Container`,
        containerPort: 9000,
        image: ecs.ContainerImage.fromDockerImageAsset(asset)
      },
      memoryLimitMiB: 512, // Default is 512
      publicLoadBalancer: true // Default is true,
    });
    
    const dynamoGatewayEndpoint = vpc.addGatewayEndpoint('dynamoGatewayEndpoint', {
      service: GatewayVpcEndpointAwsService.DYNAMODB
    });

    dynamoGatewayEndpoint.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new AnyPrincipal()],
        actions: [
          'dynamodb:PutItem',
        ],
        resources: [
          `${dynamoTable.tableArn}`
        ],
        conditions: {
          'ArnEquals': {
            'aws:PrincipalArn': `${TriageFargateService.taskDefinition.taskRole.roleArn}`
          }
        }
      })
    );

    // Write permissions for Fargate
    dynamoTable.grantWriteData(TriageFargateService.taskDefinition.taskRole);

    // Outputs
    new CfnOutput(this, 'DyanmoDBTableName', { value: dynamoTable.tableName });
  }
}

module.exports = { TriageServiceStack }
