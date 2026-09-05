import {
  Prisma,
  Profile,
  Project,
  Social,
  ProjectFeature,
  ProjectTech,
  Skill,
} from "@prisma/client";

export type ProfileDTO = Profile;

export type ProfileWithRelationsDTO = Prisma.ProfileGetPayload<{
  include: {
    skills: true;
  };
}>;

export type SkillDTO = Skill;

export type ProjectDTO = Project;

export type ProjectWithRelationsDTO = Prisma.ProjectGetPayload<{
  include: {
    features: true;
    tech: true;
  };
}>;

export type TechDTO = ProjectTech;

export type FeatureDTO = ProjectFeature;

export type SocialDTO = Social;
