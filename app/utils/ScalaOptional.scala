package utils

import java.util.Optional

object ScalaOptional{
  def toScalaOption[T](opt: Optional[T]) : Option[T] = new ScalaOptional[T](opt).toOption
}

class ScalaOptional[T] (opt: Optional[T]) {
  def toOption: Option[T] = if (opt.isPresent) Some(opt.get()) else None
}