import { requireAdmin } from "@/lib/auth-guard";
import { getSiteSettings } from "@/lib/data-access";
import { updateSiteSettings } from "@/lib/actions";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Site settings</h1>
      <p className="mt-1 text-sm text-slate-500">
        Contact details, social links, and grievance officer — shown on the Contact page.
      </p>
      <div className="mt-6 max-w-2xl rounded-xl border border-slate-200 bg-white p-6">
        <SettingsForm initial={settings} action={updateSiteSettings} />
      </div>
    </div>
  );
}
