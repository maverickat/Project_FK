Instructions For Starting the Server:
	1.Start Zookeeper
	2.Start kafka
	3.Start The React Server
	4.Create A Broker with topic pub_msg
	5.Run the ProjectApplication File
For Starting Zookeeper And Kafka:
	IN ZOOKEEPER DIRECTORY:	bin\zkServer.sh start
							bin\zkCli.sh
	IN KAFKA DIRECTORY:		bin\windows\zookeeper-server-start.bat config\zookeeper.properties
							bin\windows\kafka-server-start.bat config\server.properties
							bin\windows\kafka-topics.bat  --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic pub_msg
For Multi-Server:
	Change Port in project.yml
	Change group_id in KafkaSub file with different groups
UI:
	UI can be accessed using:
		\port_of_dropwizard\dashboard\{req_branch}
		eg:
			\8080\dashboard\branch1

