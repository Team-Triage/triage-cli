const { Stack, StackProps, CfnOutput, RemovalPolicy } = require("aws-cdk-lib");
const { GatewayVpcEndpointAwsService, Vpc} = require("aws-cdk-lib/aws-ec2");
const { AnyPrincipal, Effect, PolicyStatement } = require("aws-cdk-lib/aws-iam");

const ecs = require("aws-cdk-lib/aws-ecs");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const ecs_patterns = require("aws-cdk-lib/aws-ecs-patterns");

const DEAD_LETTER_TABLE_NAME = "TriageDeadLettersTopicName"

class TriageServiceStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const vpc = new Vpc(this, "TriageVPC", {
      maxAzs: 2 // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "TriageCluster", {
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
    const TriageFargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "TriageFargateService", {
      cluster: cluster, // Required
      cpu: 256, // Default is 256
      desiredCount: 3, // Default is 1
      taskImageOptions: {
        containerName: "triageContainer",
        containerPort: 9000,
        image: ecs.ContainerImage.fromRegistry("themikejung/triage:latest"),
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
    new CfnOutput(this, 'DynamoDbTableName', { value: dynamoTable.tableName });
  }
}

module.exports = { TriageServiceStack }
