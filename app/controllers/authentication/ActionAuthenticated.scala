package controllers.authentication

import javax.inject.Inject
import models.domain.admin.Admin
import models.domain.authentication.CaseUser
import pdi.jwt.JwtSession._
import play.api.mvc.Results._
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}


class AuthenticatedRequest[A](val user: CaseUser, request: Request[A]) extends WrappedRequest[A](request)

class AuthenticatedAction @Inject()(val parser: BodyParsers.Default)(implicit val executionContext: ExecutionContext)
extends ActionBuilder[AuthenticatedRequest, AnyContent] {
  def invokeBlock[A](request: Request[A], block: AuthenticatedRequest[A]=> Future[Result]): Future[Result] =
    request.jwtSession.getAs[CaseUser]("user") match {
      case Some(user) => block(new AuthenticatedRequest(user, request)).map(_.refreshJwtSession(request))
      case _ => Future.successful(Unauthorized)
    }
}

class AdminAction @Inject()(val parser: BodyParsers.Default)(implicit val executionContext: ExecutionContext)
  extends ActionBuilder[AuthenticatedRequest, AnyContent] {
  def invokeBlock[A](request: Request[A], block: AuthenticatedRequest[A]=> Future[Result]): Future[Result] =
    request.jwtSession.getAs[CaseUser]("user") match {
      case Some(user) if Admin.isAdmin(user) => block (new AuthenticatedRequest(user, request)).map(_.refreshJwtSession(request))
      case Some(_) => Future.successful(Forbidden.refreshJwtSession(request))
      case _ => Future.successful(Unauthorized)
    }
}
