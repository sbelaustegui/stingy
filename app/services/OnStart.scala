package services

import javax.inject.{Inject, Singleton}
import play.api.inject.ApplicationLifecycle
import models.domain.user.{User, UserCreate}

import scala.concurrent.Future

trait OnStart {
  def save(): Unit
}

@Singleton
class OnStartImpl @Inject() (appLifecycle: ApplicationLifecycle) extends OnStart {

  def createUsers(): List[User] = {
    var users: List[User] = List()
    users = User.saveOrUpdate(User(UserCreate("Sebas", "Belaustegui", "sebas@gmail.com", "sebasb", "123456"))).get :: users
    users
  }

  override def save(): Unit = {
    User.getByUsername("sebasb") match {
      case Some(_) =>
      case None =>
        createUsers()
    }
  }

  def start(): Unit = save()

  appLifecycle.addStopHook { () =>
    Future.successful(())
  }

  start()

}