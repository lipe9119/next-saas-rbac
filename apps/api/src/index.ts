import { defineAbilityFor, projectSchema } from "@saas/auth";

const ability = defineAbilityFor({ role: "MEMBER", id: "123" });

const project = projectSchema.parse({
  id: "12356",
  ownerId: "123",
});

console.log(ability.can("get", "Billing"));
console.log(ability.can("create", "Invite"));
console.log(ability.can("delete", project));
