# Cluster-Analysis
Don't forget to add 'json-simple' in pom.xml as the depencdency for project

Before running program import the open source physics library into project (https://github.com/OpenSourcePhysics/osp)

To create an import file call randomDataGenerator.js script

var1 is the title of import file (example\` dataFile )

var2 is the number of cluster nodes (example\` 25 )

var3 is the probablility (example\` 0.3)

If you run initialize without importing a data file it will generate random points with specified count and edge probability in variables

## Result of personal experiments
I have created the data file from my project were the nodes are the methods and edges are function calls
Initial state is decribed in the ./Sample Data/Analysis_Functions.txt file and the obteined data file is ./Sample Data/analysis.json

Here is the initial state of the cluster
![alt text](https://raw.githubusercontent.com/Tigran-teq-Tadevosyan/Cluster-Analysis/master/Screenshots/ClusterBefore.png)

Here is the resulting cluster formation
![alt text](https://raw.githubusercontent.com/Tigran-teq-Tadevosyan/Cluster-Analysis/master/Screenshots/ClusterAfter.png)

Cluster is also described in text form in ./Sample Data/Analysis_Cluster.txt file
