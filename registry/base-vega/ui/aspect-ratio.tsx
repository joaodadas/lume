// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, packages/ui/src/components/aspect-ratio.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: imports reescritos para @/registry/base-vega/*.
import { cn } from "@/registry/base-vega/lib/utils";

function AspectRatio({
	ratio,
	className,
	...props
}: React.ComponentProps<"div"> & { ratio: number }) {
	return (
		<div
			data-slot="aspect-ratio"
			style={
				{
					"--ratio": ratio,
				} as React.CSSProperties
			}
			className={cn("relative aspect-(--ratio)", className)}
			{...props}
		/>
	);
}

export { AspectRatio };
