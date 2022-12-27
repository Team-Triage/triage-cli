# triage-cli

`triage-cli` is a command line tool used to deploy Triage to AWS.

<h2>Prerequisites</h2>

- `npm 8.8+` 
- `docker 20.10.17+`
- `aws-cli version 2`

<h2>How to use</h2>

Before starting, be sure that you've logged into `aws-cli`. `triage-cli` will securely deploy Triage using your account info and default region.
 
 1. First, install the latest version of the `triage-cli` `npm` package with

     `npm install -g triage-cli` 

 2. Create a project directory and `cd` into it. This will contain the files necessary to deploy Triage to your AWS ecosystem.

	`mkdir myTriageProject && cd myTriageProject`

 3. Run `triage init`. This will clean up any existing files within the directory (perhaps from a previous deployment) and install dependencies necessary to deploy Triage. It will also generate a `config.properties` file in the current working directory.

	`triage init`

 4. Add the required key/value pairs to the `config.properties` file. 
	-	At a minimum, you'll need the following:
		 - `bootstrap.servers`
		 - `topic.name`
		 - `partition.count`
	 - In order for Triage to connect to your Kafka cluster, you'll also need to include the necessary key/value pairs for your specific authentication method.	 
 
 5. Run `triage deploy`
	
	`triage deploy`

	This step may take some time - up to 5 minutes. `triage-cli` will, among several other intermediary steps, deploy a number of Triage containers equal to the `partition.count` specified in `config.properties` and an application load balancer to allow access from the internet. It will also create a DynamoDB table to store any poison pill messages encountered.

6. When `triage-cli` has finished running, you will receive the following information needed to connect to Triage:
	- Triage's Network Address
		- This is an AWS internet-facing load balancer
	- Authentication Key
		- This is the key needed by consumer applications wishing to connect to Triage
	- DynamoDB Table Name
		- This is the name of the table where Triage containers will store dead-letters or poison pills. 

<h2>Teardown</h2>

To teardown a Triage deployment, simply navigate to the directory created during deployment and run `triage destroy`. This will remove all AWS resources associated with Triage.


