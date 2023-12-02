export const springTemplate = (pid, gUrl) => {
  return `<?xml version='1.1' encoding='UTF-8'?>
  <flow-definition plugin="workflow-job@1268.v6eb_e2ee1a_85a">
    <actions>
      <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@2.2118.v31fd5b_9944b_5"/>
      <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction plugin="pipeline-model-definition@2.2118.v31fd5b_9944b_5">
        <jobProperties/>
        <triggers/>
        <parameters/>
        <options/>
      </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
    </actions>
    <description></description>
    <keepDependencies>false</keepDependencies>
    <properties/>
    <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@3618.v13db_a_21f0fcf">
      <script>pipeline {
      agent any
  
      stages {
        stage(&apos;Auth&apos;) {
          steps {
              echo &quot;Authenticating to azure&quot;
              
              sh &apos;az login&apos;
              sh &apos;docker login azure&apos;
              sh &apos;az acr login --name devminiproj&apos;
              sh &apos;docker context create aci myacicontext --resource-group e41a58dc-e831-ddb7-44fd-bc60834dbffe || echo context&apos;

          }
        }


        stage(&apos;Build&apos;) {
            steps {
                echo &quot;Building the Application&quot;
                
                // Get some code from a GitHub repository
                sh &quot;git clone &apos;${gUrl}&apos;&quot;
                
                dir(&apos;${gUrl.split("/").at(-1)}&apos;){
                    
                    sh &apos;docker rm -f ${pid}-build-container || echo &quot;No pre running containers.&quot;&apos;
                    sh &apos;docker build -f BuildDockerFile -t ${pid}-build-image:latest .&apos;
                    sh &apos;docker run --name ${pid}-build-container ${pid}-build-image:latest&apos;
                    sh &apos;mkdir target&apos;
                    sh &apos;docker cp ${pid}-build-container:/project/target/App.jar ./target/App.jar &apos;
                }
                
                echo &quot;Built App.jar&quot;
            }
        }


        stage(&apos;Deploy&apos;) {
            steps {
                echo &quot;Deploying the Application&quot;
                
                dir(&apos;spring-petclinic&apos;){
                    sh &apos;docker --context myacicontext rm -f ${pid}-deploy-container || echo &quot;No pre running containers.&quot;&apos;
                    sh &apos;docker build -t devminiproj.azurecr.io/${pid}-deploy-image:latest .&apos;

                    sh &apos;docker push devminiproj.azurecr.io/${pid}-deploy-image:latest&apos;

                    sh &apos;docker --context myacicontext run -d --name ${pid}-deploy-container -p 8081:8081 devminiproj.azurecr.io/${pid}-deploy-image:latest&apos;

                    sh &apos;echo \\n\\n\\n\\n\\n&apos;
                    sh &apos;docker --context myacicontext ps&apos;
                    sh &apos;echo \\n\\n\\n\\n\\n&apos;

                }

            }
        }
          
      }
      post {
          always {
              echo &apos;Cleaning the workspace&apos;
              
              sh &quot;cd ..&quot;
              sh &apos;rm -rf ./${gUrl.split("/").at(-1)}&apos;

              sh &quot;az logout&quot;
              sh &quot;docker logout azure&quot;
              
              echo &apos;cleaned workspace&apos;
          }
      }
  }
  </script>
      <sandbox>true</sandbox>
    </definition>
    <triggers/>
    <disabled>false</disabled>
  </flow-definition>`;
};
