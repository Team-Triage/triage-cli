# Welcome to Triage cli installation tool


First, install the npm global package with `npm install -g triage-cli`

Then, navigate to a new folder and run the `triage-init` command. It will generate a `config.properties` file with the necessary key-value pairs that Triage needs to connect to a Kafka cluster and subscribe to a topic. 

Fill in these details as well as the number of partitions that exist for the topic.
Next, execute `triage-deploy`. This command will deploy a Triage instance according to the `config.properties` file to the user's AWS account. This step will also create a new DynamoDB table where they can access the dead letter messages.

Users can use the `triage-destroy` command to tear down all associated AWS resources to avoid unnecessary costs.
