"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
//import { DemandLevel, MarketOutLook } from "@prisma/client";
import { generateAIInsights } from "./dashboard";
export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // checking if the user exists in our database or not
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");
  try {
    const result = await db.$transaction(
      async (tx) => {
        //find if the industry exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });
        //if the industry doesnt exist create it with the default values- will replae it with ai later
        if (!industryInsight) {
            const insights = await generateAIInsights(data.industry);
          
               industryInsight = await db.industryInsight.create({
                data: {
                  industry: data.industry,
                  ...insights,
                  nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
              });
        }

        //update the user

        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });
        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000, //default 50000
      }
    );
    return { success: true, ...result };
  } catch (error) {
    console.error("Error updating user and industry", error.message);
    throw new Error("Failed to update profile" + error.message);
  }
}

//checking onboarding status
export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // checking if the user exists in our database or not
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    return {
      isOnboarded: !!user?.industry,  //!! (double NOT)
      //Converts the value into a boolean.
    };
  } catch (error) {
    console.error("Error checking onboarding status", error.message);
    throw new Error("Failed to check onboarding status");
  }
}
