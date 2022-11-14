const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const ecs_patterns = require("aws-cdk-lib/aws-ecs-patterns");

const { Stack, Duration } = require('aws-cdk-lib');

class TriageCliStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "TriageVPC", {
      maxAzs: 2 // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "TriageCluster", {
      vpc: vpc
    });

    // Create a load-balanced Fargate service and make it public
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "TriageFargateService", {
      cluster: cluster, // Required
      cpu: 256, // Default is 256
      desiredCount: 3, // Default is 1
      taskImageOptions: {
        containerName: "triageContainer",
        containerPort: 9000,
        image: ecs.ContainerImage.fromRegistry("themikejung/triage:latest") 
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
