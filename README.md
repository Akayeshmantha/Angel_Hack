# praedictioaws

Praedictio AWS is a fully fledged multi-tenant data-lake solution on AWS. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need to install Pythn, PIP and AWS CLI as prerequisites

On Windows 10

- Download Python 3.6.5 and before installing click on add Python to the PATH variable
- Add Pip to the path variable. It will be installed in %USERPROFILE%\AppData\Local\Programs\Python\Python36\Scripts
- Install AWS CLI
````sh
pip install -m awscli
````
- Configure AWSCLI
````sh
aws configure
AWS Access Key ID [None]: adminuser access key ID
AWS Secret Access Key [None]: adminuser secret access key
Default region name [None]: us-east-2
Default output format [None]: 
````
- Verify AWS installation using
````sh
aws help
````
- Clone PAWS to your machine from git
````
git clone https://github.com/MitraInnovationRepo/praedictioaws.git
````

### Installation

Navigate inside project folder

````sh
npm install
node app.js
````

You can view the app on brower http://localhost:8090/