"use client";

import { useTranslation } from "react-i18next";
import { DashboardOverviewPanels } from "@/components/dashboard-overview-panels";

/**
 * Homepage hero — same panels as the real dashboard (sample numbers), labeled as a preview.
 */
export function HomeHeroVisual() {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto w-full max-w-lg lg:ml-auto lg:max-w-none">
      <DashboardOverviewPanels
        variant="preview"
        currentStep={5}
        documentsCount={3}
        calendarCount={2}
        expensesCount={1}
        lastCompleted={{
          title: t("home.hero.visualPreviewLastDoneTitle"),
          dateLabel: t("home.hero.visualPreviewLastDoneDate"),
        }}
        nextEvent={{
          title: t("home.hero.visualPreviewEventTitle"),
          dateLabel: t("home.hero.visualPreviewEventDate"),
        }}
      />
    </div>
  );
}
