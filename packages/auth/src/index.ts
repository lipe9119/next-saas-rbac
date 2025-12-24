import type { CreateAbility, MongoAbility } from "@casl/ability";
import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import z from "zod";
import type { User } from "./models/user";
import { permissions } from "./permissions";
import { billingSubject } from "./subjects/billing";
import { inviteSubject } from "./subjects/invite";
import { organizationSubject } from "./subjects/organization";
import { projectSubject } from "./subjects/project";
import { userSubject } from "./subjects/user";

export * from "./models/organization";
export * from "./models/project";
export * from "./models/user";

const appAbilitiesSchemas = z.union([
  projectSubject,
  userSubject,
  organizationSubject,
  inviteSubject,
  billingSubject,
  z.tuple([z.literal("manage"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof appAbilitiesSchemas>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility);

  const { role } = user;
  if (typeof permissions[role] !== "function") {
    throw new Error(`Permissions for role ${role} not found`);
  }

  permissions[role](user, builder);

  const ability = builder.build({
    detectSubjectType: (subject) => {
      return subject.__typename;
    },
  });

  return ability;
}
