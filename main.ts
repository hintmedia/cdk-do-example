import { Construct } from 'constructs'
import { App, TerraformStack, Token } from 'cdktf'
import { DigitaloceanProvider, Droplet, Vpc} from './.gen/providers/digitalocean'
import { DatabaseCluster, DatabaseUser, DatabaseDb} from './.gen/providers/digitalocean'
import { Project, ProjectResources } from './.gen/providers/digitalocean'

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name)

    new DigitaloceanProvider(this, 'digitalocean', {
      token: Token.asString(process.env.DO_TOKEN) 
    })

    const project = new Project(this, 'example-project', {
      name: 'Example Rails Project'
    })

    const vpc = new Vpc(this, 'example-vpc', {
      name: 'example-vpc',
      region: 'sfo3'
    })

    const postgres = new DatabaseCluster(this, 'example-postgres', {
      name: 'example-postgres',
      engine: 'pg',
      version: '13',
      size: 'db-s-1vcpu-1gb',
      region: 'sfo3',
      nodeCount: 1,
      privateNetworkUuid: vpc.id
    })

    new DatabaseUser(this, 'example-postgres-user', {
      clusterId: `${postgres.id}`,
      name: 'example'
    })

    new DatabaseDb(this, 'example-postgres-db', {
      clusterId: `${postgres.id}`,
      name: 'example-db'
    })

    const droplet = new Droplet(this, 'example-droplet', {
      name: 'example-droplet',
      size: 's-1vcpu-1gb',
      region: 'sfo3',
      image: 'ubuntu-20-04-x64',
      vpcUuid: vpc.id
    })

    new ProjectResources(this, 'example-project-resources', {
      project: project.id,
      resources: [
        postgres.urn,
        droplet.urn
      ],
      dependsOn: [ postgres, droplet ]
    })
  }
}

const app = new App()
new MyStack(app, 'cdk-do-example')
app.synth()
