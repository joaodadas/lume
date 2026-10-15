// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, packages/ui/src/components/skeleton.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: imports reescritos para @/registry/base-vega/*.
import { cn } from "@/registry/base-vega/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn(
				"animate-pulse rounded-md squircle:rounded-2xl corner-squircle bg-muted",
				className,
			)}
			{...props}
		/>
	);
}

export { Skeleton };
