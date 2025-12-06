import { style } from "@vanilla-extract/css";
import { BOTTOM_NAV_HEIGHT } from "../shared/ui/constants";

export const main = style({
	height: `calc(100vh - ${BOTTOM_NAV_HEIGHT}px - env(safe-area-inset-bottom, 0px))`,
	display: "flex",
	flexDirection: "column",
	overflow: "hidden",
});
