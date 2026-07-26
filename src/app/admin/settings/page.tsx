import { requirePermission } from "@/lib/auth-guard";
import { getSiteSettings } from "@/lib/data-access";
import { updateSiteSettings } from "@/lib/actions";
import { PageHeader } from "@/components/admin/ui";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  await requirePermission("settings.view");
  const settings = await getSiteSettings();

  return (
    <div>
      <PageHeader title="Site settings" subtitle="Contact details, social links, and grievance officer — shown on the Contact page." />
      <div className="max-w-2xl">
        <SettingsForm initial={settings} action={updateSiteSettings} />
      </div>
    </div>
  );
}
