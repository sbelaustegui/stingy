package controllers.authentication

import models.domain.authentication.CaseUser
import pdi.jwt.JwtSession._
import play.api.mvc.Results._
import play.api.mvc._
import scala.concurrent.ExecutionContext.Implicits.global

import scala.concurrent.{ExecutionContext, Future}


class AuthenticatedRequest[A](val user: CaseUser, request: Request[A]) extends WrappedRequest[A](request)

object AuthenticatedAction extends ActionBuilder[AuthenticatedRequest, AnyContent] {
  def invokeBlock[A](request: Request[A], block: AuthenticatedRequest[A]=> Future[Result]): Future[Result] =
    request.jwtSession.getAs[CaseUser]("user") match {
      case Some(user) => block(new AuthenticatedRequest(user, request)).map(_.refreshJwtSession(request))
      case _ => Future.successful(Unauthorized)
    }

  override def parser: BodyParser[AnyContent] = AuthenticatedAction.parser

  override protected def executionContext: ExecutionContext = AuthenticatedAction.executionContext
}
