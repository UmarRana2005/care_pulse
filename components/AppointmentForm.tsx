"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import { useState } from "react";
import SubmitButton from "./SubmitButton";
import { getAppointmentSchema } from "@/lib/Validations";
import { useRouter } from "next/navigation";
import { createUserAction } from "@/lib/actions/create-user"; // 👈 new import
import { InputType } from "./PatientForm";
import { SelectItem } from "./ui/select";
import { Doctors } from "@/constants";
import Image from "next/image";
import { createAppointment } from "@/lib/actions/appointment.action";

const AppointmentForm = ({
  userId,
  patientId,
  type,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const AppointFormValidation = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof AppointFormValidation>>({
    resolver: zodResolver(AppointFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      cancellationReason: "",
      note: "",
    },
  });

  async function onSubmit(values: z.infer<typeof AppointFormValidation>) {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }
    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };
        const appointment = await createAppointment(appointmentData);
        if (appointment) {
          setIsLoading(false);
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
    }
  }
  let buttonLabel;
  switch (type) {
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    default:
      buttonLabel = "Submit";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type !== "cancel" && (
          <>
            <section className="mb-12 space-y-4">
              <h1 className="header">New Appointment 👋</h1>
              <p className="text-dark-700">
                Request the new appointment in 10 seconds.
              </p>
            </section>
            <CustomFormField
              control={form.control}
              inputType={InputType.SELECT}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a Doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />
                    <span className="text-dark-700">{doctor.name}</span>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              control={form.control}
              inputType={InputType.DATE_PICKER}
              name="schedule"
              label="Expected Appointment Date"
              showTimeSelect={true}
              dateFormat="MM/dd/yyyy - h:mm aa"
            />

            <div className="flex-col equal-width-fields xl:flex-row">
              <CustomFormField
                control={form.control}
                inputType={InputType.TEXTAREA}
                name="reason"
                label="Reason for Appointment"
                placeholder="Describe the reason for your appointment"
              />
              <CustomFormField
                control={form.control}
                inputType={InputType.TEXTAREA}
                name="note"
                label="Additional Notes"
                placeholder="Any additional Notes or Instructions"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <>
            <h2 className="sub-header">Cancel Appointment</h2>
            <p className="text-dark-700">
              We are sorry to see you go. Please let us know why you are
              canceling.
            </p>
            <CustomFormField
              control={form.control}
              inputType={InputType.TEXTAREA}
              name="cancellationReason"
              label="Cancellation Reason"
              placeholder="Please provide a reason for cancellation"
            />
          </>
        )}
        <SubmitButton
          isLoading={isLoading}
          className={`w-full ${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          }`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
