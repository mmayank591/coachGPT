import { boolean, z } from "zod";

export const onboardingSchema = z.object({
  industry: z.string({
    required_error: "please select an industry",
  }),
  subIndustry: z.string({
    required_error: "please select an specialization",
  }),
  bio: z.string().max(500).optional(),
  experience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, "Experience must be at leat 0 years")
        .max(50, "Experience cannot exceed 50 years")
    ),
  skills: z.string().transform(
    //z.string() – expect the input to be a string.
    (
      // .transform(...) – transform that string into                         something else  (in this case, an array).
      val
    ) =>
      val
        ? val
            .split(",") //splits the string into an array by commas.
            .map((skill) => skill.trim()) //emoves extra spaces from each skill.
            .filter(boolean) //removes empty strings like "" (e.g., from trailing commas)
        : undefined // If val is empty or falsy, return undefined.
  ),
});

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export const entrySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );

  export const resumeSchema = z.object({
    contactInfo: contactSchema,
    summary: z.string().min(1, "Professional summary is required"),
    skills: z.string().min(1, "Skills are required"),
    experience: z.array(entrySchema),
    education: z.array(entrySchema),
    projects: z.array(entrySchema),
  });
  export const coverLetterSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    jobDescription: z.string().min(1, "Job description is required"),
  });