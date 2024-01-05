import { useState, useCallback } from "react";
import { LegacyCard,Tabs} from "@shopify/polaris";

import { useAppQuery } from "../hooks";
import { OfferEditTabsList } from "../shared/constants/OfferEditTabList";

export function OfferEdit() {

  const shopAndHost = useSelector(state => state.shopAndHost);
  const [isLoading, setIsLoading]   = useState(true);
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: '/api/v1/offers',
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  return (
     <LegacyCard>
      <Tabs tabs={OfferEditTabsList} selected={selected} onSelect={handleTabChange}>
        <LegacyCard.Section title={tabs[selected].content}>
          <p>Tab {selected} selected</p>
        </LegacyCard.Section>
      </Tabs>
    </LegacyCard>
  );
};
