// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, packages/ui/src/components/separator.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: imports reescritos para @/registry/base-vega/*.
"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "@/registry/base-vega/lib/utils";

function Separator({
	className,
	orientation = "horizontal",
	...props
}: SeparatorPrimitive.Props) {
	return (
		<SeparatorPrimitive
			data-slot="separator"
			orientation={orientation}
			className={cn(
				"shrink-0 bg-border/70 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
				className,
			)}
			{...props}
		/>
	);
}

export { Separator };
