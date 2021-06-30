# CDKTF Digital Ocean Example

## Try It Out

To use cdktf you will need the following packages installed:

- Terraform ≥ 0.12
- Node.js ≥ 12.16
- Yarn ≥ 1.21

To install cdktf, we will use `npm install`

`$ npm install --global cdktf-cli`

You will also need to [create a personal access token](https://docs.digitalocean.com/reference/api/create-personal-access-token/) on Digital Ocean if you would like to deploy this config.

With that out of the way, let's deploy our example.

`$ DO_TOKEN=<your personal access token> cdktf deploy`

To clean up, run:

`$ DO_TOKEN=<your personal access token> cdktf destroy`