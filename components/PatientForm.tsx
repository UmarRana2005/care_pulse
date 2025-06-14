"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import { useState } from "react";
import SubmitButton from "./SubmitButton";
import { UserFormSchema } from "@/lib/Validations";
import { useRouter } from "next/navigation";
import { createUserAction } from "@/lib/actions/create-user"; // 👈 new import

export enum InputType {
  INPUT = "input",
  TEL = "tel",
  DATE_PICKER = "datePicker",
  TIME = "time",
  SELECT = "select",
  TEXTAREA = "textarea",
  RADIO = "radio",
  CHECKBOX = "checkbox",
  FILE = "file",
  Skeleton = "skeleton"
}

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    },
  });

  async function onSubmit(values: z.infer<typeof UserFormSchema>) {
    setIsLoading(true);
    try {
      const user = await createUserAction(values); // ✅ Call server action

      if (user) {
        setIsLoading(false);
        router.push(`/patients/${user.$id}/register`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
        </section>
        <CustomFormField
          control={form.control}
          inputType={InputType.INPUT}
          name="name"
          placeholder="i.e., Umar Rana"
          label="Full Name"
          icon_src="/assets/icons/user.svg"
          icon_alt="User_icon"
        />
        <CustomFormField
          control={form.control}
          inputType={InputType.INPUT}
          name="email"
          placeholder="i.e., umar@gmail.com"
          label="Email"
          icon_src="/assets/icons/email.svg"
          icon_alt="Email_Icon"
        />
        <CustomFormField
          control={form.control}
          inputType={InputType.TEL}
          name="phone"
          placeholder="(555) 454-2356"
          label="Phone Number"
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
