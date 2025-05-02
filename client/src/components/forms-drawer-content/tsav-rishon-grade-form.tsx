import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MILITARY } from "@/i18n/military";
import {
  SideDrawerFooter,
  SideDrawerAction,
} from "@/components/ui/side-drawer";
import type { FormValues } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DeselectableSelect } from "../ui/desectable-select";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const ALL_LEADS = [
  "Lea Levi",
  "David Ben Haim",
  "Sarah Cohen",
  "Jonathan Mizrahi",
  "Noa Azoulay",
];

const TsavRishonDrawerContent = (closeDrawer: () => void): React.ReactNode => {
  const [search, setSearch] = React.useState("");
  const form = useForm<FormValues>({
    defaultValues: {
      leads: [],
      noteDapar: "",
      simoulIvrit: "",
      profileMedical: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Formulaire soumis :", values);
    closeDrawer();
  };

  // Conversion des options pour le format attendu par DeselectableSelect
  const daparOptions = MILITARY.dapar_grades.map(({ value, displayName }) => ({
    value: String(value),
    label: displayName,
  }));

  const hebrewOptions = MILITARY.hebrew_grade.map(({ value, displayName }) => ({
    value: String(value),
    label: displayName,
  }));

  const medicalOptions = MILITARY.medical_profile.map(
    ({ value, displayName }) => ({
      value: String(value),
      label: displayName,
    })
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-4"
        id="tsav-rishon-form"
      >
        {/* Multi-select Leads avec style harmonisé */}
        <FormField
          control={form.control}
          name="leads"
          render={({ field }) => {
            const leadsValue = Array.isArray(field.value) ? field.value : [];

            const filteredLeads = ALL_LEADS.filter((lead) =>
              lead.toLowerCase().includes(search.toLowerCase())
            );

            const toggleLead = (lead: string) => {
              if (leadsValue.includes(lead)) {
                field.onChange(leadsValue.filter((l) => l !== lead));
              } else {
                field.onChange([...leadsValue, lead]);
              }
            };

            return (
              <FormItem>
                <FormLabel>Futur(e)s soldat(e)s</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal text-left font-medium"
                      >
                        {leadsValue.length > 0
                          ? `${leadsValue.length} sélectionné(s)`
                          : "Sélectionner des leads"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Rechercher un lead..."
                        value={search}
                        onValueChange={setSearch}
                      />
                      <CommandList>
                        <CommandEmpty>Aucun lead trouvé</CommandEmpty>
                        <CommandGroup>
                          {filteredLeads.map((lead) => (
                            <CommandItem
                              key={lead}
                              onSelect={() => toggleLead(lead)}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <Checkbox
                                  checked={leadsValue.includes(lead)}
                                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                />
                                {lead}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Note Dapar avec DeselectableSelect */}
        <FormField
          control={form.control}
          name="noteDapar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Dapar</FormLabel>
              <FormControl>
                <DeselectableSelect
                  options={daparOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Sélectionner une note"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Simoul Ivrit avec DeselectableSelect */}
        <FormField
          control={form.control}
          name="simoulIvrit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Simoul Ivrit</FormLabel>
              <FormControl>
                <DeselectableSelect
                  options={hebrewOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Sélectionner une note"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Profil Médical avec DeselectableSelect */}
        <FormField
          control={form.control}
          name="profileMedical"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profil médical</FormLabel>
              <FormControl>
                <DeselectableSelect
                  options={medicalOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Sélectionner un profil"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SideDrawerFooter>
          <SideDrawerAction
            onSave={() => console.log(form.getValues())}
            buttonContent="Enregistrer"
            type="submit"
            formId="tsav-rishon-form"
          />
        </SideDrawerFooter>
      </form>
    </Form>
  );
};

export default TsavRishonDrawerContent;
