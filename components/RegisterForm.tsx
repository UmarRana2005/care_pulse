"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import { useState } from "react";
import SubmitButton from "./SubmitButton";
import { PatientFormValidation } from "@/lib/Validations";
import { useRouter } from "next/navigation";
import { InputType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "./ui/label";
import { SelectItem } from "./ui/select";
import Image from "next/image";
import FileUploader from "./FileUploader";
import { registerPatient } from "@/lib/actions/patient.actions";

const RegisterForm = ({user}:{user:User}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: ""
    },
  })

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);
    let formData;

    if(values.identificationDocument && values.identificationDocument.length > 0){
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      })

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        IdentificationDocument: formData
      }

      // @ts-ignore
      const patient = await registerPatient(patientData);
      if(patient) router.push(`/patients/${user.$id}/new-appointment`)
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
          <h2 className="sub-header">Personal Information</h2>
            </div>
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
        <div className="equal-width-fields flex-col xl:flex-row justify-between">
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
        </div>
         <div className="equal-width-fields flex-col xl:flex-row justify-between">
           <CustomFormField
          control={form.control}
          inputType={InputType.DATE_PICKER}
          name="dateofbirth"
          label="Date of Birth"
        />
              <CustomFormField
             control={form.control}
             inputType={InputType.Skeleton}
             name="gender"
             label="Gender"
             renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                        <RadioGroupItem
                        value={option}
                        id={option}
                        />
                        <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                    </div>
                ))}
                </RadioGroup>
              </FormControl>
             )}
             />
        </div>
        <div className="equal-width-fields flex-col xl:flex-row justify-between">
             <CustomFormField
          control={form.control}
          inputType={InputType.INPUT}
          name="address"
          placeholder="i.e., 123 Main St"
          label="Address"
        />
        <CustomFormField
          control={form.control}
          inputType={InputType.INPUT}
          name="occupation"
          placeholder="i.e., Software Engineer"
          label="Occupation"
        />
        </div>
        <div className="equal-width-fields flex-col xl:flex-row justify-between">
           <CustomFormField
          control={form.control}
          inputType={InputType.INPUT}
          name="emergency_contact_name"
          placeholder="i.e., Guardian's Name"
          label="Emergency Contact Name"
        />
        <CustomFormField
          control={form.control}
          inputType={InputType.TEL}
          name="emergency_contact_phone"
          placeholder="(555) 454-2356"
          label="Emergency Contact Phone"
        />
        </div>
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
          <h2 className="sub-header">Medical Information</h2>
            </div>
        </section>
        <CustomFormField
          control={form.control}
          inputType={InputType.SELECT}
          name="primary_care_physician"
          label="Primary Care Physician"
          placeholder="Select Physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem
              key={doctor.name}
              value={doctor.name}
            >
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  width={32}
                  height={32}
                  className="rounded-full border border-dark-500"/>
                <span className="text-dark-700">{doctor.name}</span>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
        <div className="equal-width-fields flex-col xl:flex-row justify-between">
          <CustomFormField
          control={form.control}
          inputType={InputType.TEXTAREA}
          name="allergies"
          placeholder="i.e., Pollen, Peanuts"
          label="Allergies (if any)"
        />
        <CustomFormField
          control={form.control}
          inputType={InputType.TEXTAREA}
          name="current_medication"
          placeholder="i.e., Ibuprofen 200mg, Paracetamol 500mg"
          label="Current Medication (if any)"
        />
        </div>
        <div className="equal-width-fields flex-col xl:flex-row justify-between">
          <CustomFormField
          control={form.control}
          inputType={InputType.TEXTAREA}
          name="family_medical_history"
          placeholder="No disease in Family"
          label="Family Medical History (if relevent)"
        />
        <CustomFormField
          control={form.control}
          inputType={InputType.TEXTAREA}
          name="past_medical_history"
          placeholder="No disease in Past"
          label="Past Medical History"
        />
        </div>
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
          <h2 className="sub-header">Identification And Verification</h2>
            </div>
        </section>
          <CustomFormField
          control={form.control}
          inputType={InputType.SELECT}
          name="indentification_type"
          label="Identification Type"
          placeholder="Select an Identification Type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem
              key={type}
              value={type}
            >
                <span className="text-dark-700">{type}</span>
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          control={form.control}
          inputType={InputType.INPUT}
          name="identification_number"
          placeholder="i.e., 1234566"
          label="Identification Number"
        />
        <CustomFormField
             control={form.control}
             inputType={InputType.Skeleton}
             name="identification_image"
             label="Scanned Copy of Identification Document"
             renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange}/>
              </FormControl>
             )}
             />
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Consent And Privacy</h2>
            </div>
        </section>
        <CustomFormField
          control={form.control}
          inputType={InputType.CHECKBOX}
          name="treatment_consent"
          label="I consent to treatment"
        />
        <CustomFormField
          control={form.control}
          inputType={InputType.CHECKBOX}
          name="disclosure_consent"
          label="I consent to disclosure of information"
        />
        <CustomFormField
          control={form.control}
          inputType={InputType.CHECKBOX}
          name="privacy_consent"
          label="I consent to the privacy policy"
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
