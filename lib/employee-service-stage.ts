import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { EmployeeServiceStack } from "./employee-service-stack";


export class EmployeeServiceStage extends Stage {
    constructor(scope: Construct, stageName: string, props?:StageProps) {
        super(scope, stageName, props);
        new EmployeeServiceStack(this, 'employee-service-stack', stageName);
    }
}