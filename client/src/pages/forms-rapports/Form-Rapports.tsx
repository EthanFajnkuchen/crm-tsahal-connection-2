import CardForm from "@/components/app-components/card-form/card-form";
import Section from "@/components/app-components/section/section";
import TsavRishonDrawerContent from "@/components/forms-drawer-content/tsav-rishon-grade-form";
import TsavRishonDateDrawerContent from "@/components/forms-drawer-content/tsav-rishon-date-form";
import GiyusDrawerContent from "@/components/forms-drawer-content/giyus-form";

const FormsRapports: React.FC = () => {
  return (
    <div className="min-h-[90vh]">
      <Section title="Formulaires">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardForm
            title="Formulaire Tsav Rishon/Notes"
            description="Assigner des notes de Tsav Rishon à un ou plusieurs futurs soldats."
            className="max-w-md"
            drawerTitle="Notes Tsav Rishon"
            drawerContent={TsavRishonDrawerContent}
          />

          <CardForm
            title="Formulaire Tsav Rishon/Date"
            description="Enregistrer la date et le lieu de recrutement du Tsav Rishon."
            className="max-w-md"
            drawerTitle="Date & Lieu Tsav Rishon"
            drawerContent={TsavRishonDateDrawerContent}
          />

          <CardForm
            title="Formulaire Giyus"
            description="Enregistrer la date de Giyus et le programme Michve Alon pour les futurs soldats."
            className="max-w-md"
            drawerTitle="Giyus"
            drawerContent={GiyusDrawerContent}
          />
        </div>
      </Section>
    </div>
  );
};

export default FormsRapports;
