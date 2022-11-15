
const { Stack, Duration } = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const iam = require("aws-cdk-lib/aws-iam");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const ecs_patterns = require("aws-cdk-lib/aws-ecs-patterns");

const DEAD_LETTER_TABLE_NAME = "TriageDeadLettersTopicName"

class TriageCliStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const describeAcmCertificates = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          resources: ["arn:aws:acm:*:*:certificate/*"],
          actions: ["acm:DescribeCertificate"],
        }),
      ],
    });

    // 👇 Create Role
    const role = new iam.Role(this, "dynamo-writer", {
      assumedBy: new iam.ServicePrincipal("dynamodb.amazonaws.com"),
      description: "Allows Triage to write dead letters to the dynamoDB writer",
      inlinePolicies: {
        DescribeACMCerts: describeAcmCertificates,
      },
    });

    role.addToPolicy(new iam.PolicyStatement({
      actions: [
      "dynamodb:BatchGet*",
      "dynamodb:DescribeStream",
      "dynamodb:DescribeTable",
      "dynamodb:Get*",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchWrite*",
      "dynamodb:CreateTable",
      "dynamodb:Delete*",
      "dynamodb:Update*",
      "dynamodb:PutItem"
      ],
      resources: [`arn:aws:dynamodb:*:*:table/${DEAD_LETTER_TABLE_NAME}`],
    }))

    const vpc = new ec2.Vpc(this, "TriageVPC", {
      maxAzs: 2 // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "TriageCluster", {
      vpc: vpc
    });

    const table = new dynamodb.Table(this, DEAD_LETTER_TABLE_NAME, { 
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Should support surge in poison pills
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS,
      pointInTimeRecovery: true,
      partitionKey: { name: "UUID", type: dynamodb.AttributeType.STRING },
      sortKey: {name: "TIMESTAMP", type: dynamodb.AttributeType.STRING},
    });

    // Create a load-balanced Fargate service and make it public
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "TriageFargateService", {
      cluster: cluster, // Required
      cpu: 256, // Default is 256
      desiredCount: 3, // Default is 1
      taskImageOptions: {
        containerName: "triageContainer",
        containerPort: 9000,
        image: ecs.ContainerImage.fromRegistry("themikejung/triage:latest"),
        taskRole: role,
      },
      memoryLimitMiB: 512, // Default is 512
      publicLoadBalancer: true // Default is true,
    });
    

    // triageFargateService.targetGroup.configureHealthCheck({
    //   path: "/health",
    // });
  }
}

module.exports = { TriageCliStack }
