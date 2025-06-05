#!/bin/bash
commit_id=${BUILD_ID}-$(git rev-parse --short HEAD)
echo $commit_id> commit_id.txt
sudo docker build --build-arg D_F=$DEBUG_FLUSH -t anuvaadio/$image_name:$commit_id .
sudo docker login -u $dockerhub_user -p $dockerhub_pass
sudo docker push anuvaadio/$image_name:$commit_id
