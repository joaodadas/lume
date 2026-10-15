// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, packages/ui/src/components/label.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: imports reescritos para @/registry/base-vega/*.
"use client";

import type * as React from "react";

import { cn } from "@/registry/base-vega/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
	return (
		<label
			data-slot="label"
			className={cn(
				"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export { Label };
