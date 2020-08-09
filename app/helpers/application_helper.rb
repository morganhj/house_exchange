module ApplicationHelper
  def navbar_class(classes)
    content_for :navbar_class, classes
  end

  def main_class(classes)
    content_for :main_class, classes
  end
end
