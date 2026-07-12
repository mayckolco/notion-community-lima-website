"use client";

import { useMemo } from "react";
import {
  Map,
  MapControls,
  MapPointsLayer,
} from "@/components/ui/mapcn-layer-markers";
import { CommunityMapPopupContent } from "@/components/comunidad/CommunityMapPopupContent";
import type { ComunidadMember } from "@/lib/notion/comunidad";
import { comunidadMembersToGeoJSON } from "@/lib/notion/comunidad";

const PERU_CENTER: [number, number] = [-77.0428, -12.0464];
const DEFAULT_ZOOM = 5;

interface CommunityMapProps {
  members: ComunidadMember[];
}

export function CommunityMap({ members }: CommunityMapProps) {
  const geoJSON = useMemo(() => comunidadMembersToGeoJSON(members), [members]);

  return (
    <div className="community-map relative z-0 h-[min(70vh,520px)] w-full rounded-xl border border-border bg-card shadow-soft">
      <Map center={PERU_CENTER} zoom={DEFAULT_ZOOM} className="h-full w-full rounded-xl">
        <MapPointsLayer
          data={geoJSON}
          renderPopup={(point) => (
            <CommunityMapPopupContent ciudad={point.ciudad} count={point.count} />
          )}
        />
        <MapControls showZoom showLocate={false} />
      </Map>
    </div>
  );
}
