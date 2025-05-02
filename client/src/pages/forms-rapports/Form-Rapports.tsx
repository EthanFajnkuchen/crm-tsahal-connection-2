import CardForm from "@/components/app-components/card-form/card-form";
import Section from "@/components/app-components/section/section";
import TsavRishonDrawerContent from "@/components/forms-drawer-content/tsav-rishon-grade-form";

const FormsRapports: React.FC = () => {
  return (
    <div className="min-h-[90vh]">
      <Section title="Formulaires">
        <CardForm
          title="Formulaire Tsav Rishon/Notes"
          description="Assigner des notes de Tsav Rishon à un ou plusieurs futurs soldats."
          className="max-w-md"
          drawerTitle="Note Tsav Rishon"
          drawerContent={TsavRishonDrawerContent}
        />
      </Section>
    </div>
  );
};

export default FormsRapports;
