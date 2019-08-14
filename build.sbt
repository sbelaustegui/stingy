
name := """stingy"""

version := "1.0"

lazy val root = (project in file(".")).enablePlugins(PlayJava, PlayEbean).settings(
  watchSources ++= (baseDirectory.value / "public/ui" ** "*").get
)

resolvers += Resolver.sonatypeRepo("snapshots")

scalaVersion := "2.12.3"

libraryDependencies += jdbc
libraryDependencies += guice
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % Test
libraryDependencies += "com.h2database" % "h2" % "1.4.196"
libraryDependencies += "com.pauldijou" %% "jwt-play" % "0.16.0"
libraryDependencies += "io.ebean" % "ebean" % "11.7.1"
libraryDependencies += "mysql" % "mysql-connector-java" % "8.0.15"
libraryDependencies += "org.mindrot" % "jbcrypt" % "0.3m"
libraryDependencies += "com.amazonaws" % "aws-java-sdk-s3" % "1.11.234"

playEbeanModels in Compile := Seq("models.*")
playEbeanDebugLevel := 4
playEbeanAgentArgs += ("detect" -> "false")