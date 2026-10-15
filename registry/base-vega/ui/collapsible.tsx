// Derivado do Foglamp (https://github.com/foglamp-labs/foglamp, packages/ui/src/components/collapsible.tsx @ 2bc3bb5), Apache-2.0.
// Modificado por joaodadas/lume: imports reescritos para @/registry/base-vega/*.
"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
	return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
	return (
		<CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
	);
}

function CollapsibleContent({ ...props }: CollapsiblePrimitive.Panel.Props) {
	return (
		<CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
	);
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
