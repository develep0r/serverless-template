"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerlessTemplateStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const pipelines_1 = require("aws-cdk-lib/pipelines");
const employee_service_stage_1 = require("./employee-service-stage");
class ServerlessTemplateStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Code Pipeline Setup
        const codePipeline = new pipelines_1.CodePipeline(this, 'employee-pipeline', {
            pipelineName: 'employee-pipeline',
            dockerEnabledForSynth: true,
            synth: new pipelines_1.ShellStep('Build', {
                input: pipelines_1.CodePipelineSource.gitHub('develep0r/serverless-template', 'master'),
                commands: ['npm ci', 'npm run build', 'npx cdk synth']
            })
        });
        const staging = codePipeline.addStage(new employee_service_stage_1.EmployeeServiceStage(this, 'staging', {
            env: { account: '478602235759', region: 'us-east-1' }
        }));
        staging.addPost(new pipelines_1.ManualApprovalStep('APPROVAL REQUIRED: Deploy to Production'));
        const production = codePipeline.addStage(new employee_service_stage_1.EmployeeServiceStage(this, 'production', {
            env: { account: '478602235759', region: 'us-east-1' }
        }));
    }
}
exports.ServerlessTemplateStack = ServerlessTemplateStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVybGVzcy10ZW1wbGF0ZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcnZlcmxlc3MtdGVtcGxhdGUtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQWdEO0FBQ2hELHFEQUF3RztBQUV4RyxxRUFBZ0U7QUFFaEUsTUFBYSx1QkFBd0IsU0FBUSxtQkFBSztJQUNoRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLHNCQUFzQjtRQUN0QixNQUFNLFlBQVksR0FBRyxJQUFJLHdCQUFZLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQy9ELFlBQVksRUFBRSxtQkFBbUI7WUFDakMscUJBQXFCLEVBQUUsSUFBSTtZQUMzQixLQUFLLEVBQUUsSUFBSSxxQkFBUyxDQUFDLE9BQU8sRUFBRTtnQkFDNUIsS0FBSyxFQUFFLDhCQUFrQixDQUFDLE1BQU0sQ0FBQywrQkFBK0IsRUFBRSxRQUFRLENBQUM7Z0JBQzNFLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDO2FBQ3ZELENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksNkNBQW9CLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUM5RSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUM7U0FDckQsQ0FBQyxDQUFDLENBQUM7UUFFSixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksOEJBQWtCLENBQUMseUNBQXlDLENBQUMsQ0FBQyxDQUFDO1FBRW5GLE1BQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSw2Q0FBb0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3BGLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBQztTQUNyRCxDQUFDLENBQUMsQ0FBQztJQUVOLENBQUM7Q0FDRjtBQXpCRCwwREF5QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvZGVQaXBlbGluZSwgQ29kZVBpcGVsaW5lU291cmNlLCBNYW51YWxBcHByb3ZhbFN0ZXAsIFNoZWxsU3RlcCB9IGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEVtcGxveWVlU2VydmljZVN0YWdlIH0gZnJvbSAnLi9lbXBsb3llZS1zZXJ2aWNlLXN0YWdlJztcblxuZXhwb3J0IGNsYXNzIFNlcnZlcmxlc3NUZW1wbGF0ZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIENvZGUgUGlwZWxpbmUgU2V0dXBcbiAgICBjb25zdCBjb2RlUGlwZWxpbmUgPSBuZXcgQ29kZVBpcGVsaW5lKHRoaXMsICdlbXBsb3llZS1waXBlbGluZScsIHtcbiAgICAgIHBpcGVsaW5lTmFtZTogJ2VtcGxveWVlLXBpcGVsaW5lJyxcbiAgICAgIGRvY2tlckVuYWJsZWRGb3JTeW50aDogdHJ1ZSxcbiAgICAgIHN5bnRoOiBuZXcgU2hlbGxTdGVwKCdCdWlsZCcsIHtcbiAgICAgICAgaW5wdXQ6IENvZGVQaXBlbGluZVNvdXJjZS5naXRIdWIoJ2RldmVsZXAwci9zZXJ2ZXJsZXNzLXRlbXBsYXRlJywgJ21hc3RlcicpLFxuICAgICAgICBjb21tYW5kczogWyducG0gY2knLCAnbnBtIHJ1biBidWlsZCcsICducHggY2RrIHN5bnRoJ11cbiAgICAgIH0pXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGFnaW5nID0gY29kZVBpcGVsaW5lLmFkZFN0YWdlKG5ldyBFbXBsb3llZVNlcnZpY2VTdGFnZSh0aGlzLCAnc3RhZ2luZycsIHtcbiAgICAgIGVudjogeyBhY2NvdW50OiAnNDc4NjAyMjM1NzU5JywgcmVnaW9uOiAndXMtZWFzdC0xJ31cbiAgICB9KSk7XG5cbiAgICBzdGFnaW5nLmFkZFBvc3QobmV3IE1hbnVhbEFwcHJvdmFsU3RlcCgnQVBQUk9WQUwgUkVRVUlSRUQ6IERlcGxveSB0byBQcm9kdWN0aW9uJykpO1xuXG4gICAgY29uc3QgcHJvZHVjdGlvbiA9IGNvZGVQaXBlbGluZS5hZGRTdGFnZShuZXcgRW1wbG95ZWVTZXJ2aWNlU3RhZ2UodGhpcywgJ3Byb2R1Y3Rpb24nLCB7XG4gICAgICBlbnY6IHsgYWNjb3VudDogJzQ3ODYwMjIzNTc1OScsIHJlZ2lvbjogJ3VzLWVhc3QtMSd9XG4gICAgfSkpO1xuXG4gIH1cbn0iXX0=