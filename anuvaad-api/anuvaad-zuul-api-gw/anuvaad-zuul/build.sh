#!/bin/bash
export JAVA_HOME=/usr/lib/jvm/java-17-amazon-corretto.x86_64
export MAVEN_HOME=/opt/apache-maven-3.2.5
mvn -version
java --version
mvn compile
mvn clean install


commit_id=${BUILD_ID}-$(git rev-parse --short HEAD)
#commit_id=$(git rev-parse --short HEAD)
echo $commit_id> commit_id.txt
sudo docker build -t anuvaadio/$image_name:$commit_id .
sudo docker login -u $dockerhub_user -p $dockerhub_pass
sudo docker push anuvaadio/$image_name:$commit_id
