import { Link, LinkProps } from "@tanstack/react-router";
import { MouseEventHandler, forwardRef } from "react";

const LinkButtonComponent = forwardRef<
  HTMLAnchorElement,
  LinkProps & { onClick?: MouseEventHandler<HTMLAnchorElement> }
>(({ onClick, ...props }, ref) => <Link ref={ref} {...props} onClick={onClick} />);

LinkButtonComponent.displayName = "LinkButton";

export default LinkButtonComponent;
