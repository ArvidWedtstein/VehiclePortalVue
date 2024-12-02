<script setup lang="ts">
import ChangelogList from '@/components/general/changelog/ChangelogList.vue';
import ChangelogListItem from '@/components/general/changelog/ChangelogListItem.vue';
import type { Database, Tables } from '@/database.types';
import { useChangelogStore } from '@/stores/changelog';
import { calculateJsonChanges } from '@/utils/utils';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

const changelogStore = useChangelogStore();

const { changelog } = storeToRefs(changelogStore);
const { getChangelog } = changelogStore;

type TableNames = keyof Database[Extract<keyof Database, 'public'>]['Tables'];

onMounted(async () => {
  getChangelog();
});

const generateChangelogSentence = (entry: Tables<'changelog_with_profile'>) => {
  const { table_name, operation, changes, createdby_name } = entry;

  if (!table_name) return '';

  const { new: newChanges = {}, old: oldChanges = {} } = changes as {
    new: Record<string, string>;
    old: Record<string, string>;
  };

  const changedValues = calculateJsonChanges(oldChanges, newChanges);

  let sentence = '',
    action = '';

  const tableSentenceMappings: {
    [key in Exclude<
      TableNames,
      | 'Changelog'
      | 'VehicleEngines'
      | 'VehicleTransmissions'
      | 'Roles'
      | 'Profiles'
      | 'RolesPermissions'
    >]: {
      INSERT?: string;
      UPDATE?: string;
      DELETE?: string;
    };
  } = {
    Vehicles: {
      INSERT: `Created a new vrhicle`,
      UPDATE: `Updated vehicle`,
      DELETE: `Deleted a vehicle`,
    },
    VehicleShares: {
      INSERT: `Shared vehicle`,
      UPDATE: `Updated share status`,
      DELETE: `Unshared vehicle`,
    },
    VehicleExpenses: {
      INSERT: `Added a expense`,
      UPDATE: `Updated a expense`,
      DELETE: `Deleted a expense`,
    },
    VehicleServiceLogs: {
      INSERT: `Added a Service`,
      UPDATE: `Updated a Service`,
      DELETE: `Deleted a Service`,
    },
    VehicleDocuments: {
      INSERT: `added file '$nn'`,
      UPDATE: `Changed file '$on' to '$nn'`,
      DELETE: `deleted file '$on'`,
    },
  };

  switch (operation) {
    case 'INSERT': {
      action =
        table_name in tableSentenceMappings
          ? tableSentenceMappings[
              table_name as keyof typeof tableSentenceMappings
            ][operation]?.replace('$nn', newChanges['name']) || 'added an entry'
          : 'added an entry';

      break;
    }

    case 'UPDATE': {
      action =
        table_name in tableSentenceMappings
          ? tableSentenceMappings[
              table_name as keyof typeof tableSentenceMappings
            ][operation]
              ?.replace('$on', oldChanges['name'])
              .replace('$nn', newChanges['name']) || 'updated an entry'
          : 'updated an entry';

      sentence = `Changed ${changedValues.map(({ field, oldValue, newValue }) => `<code>${field}</code> ${!!oldValue ? `from '${oldValue}' ` : ''}to '${newValue}'`)}`;

      break;
    }

    case 'DELETE': {
      action =
        table_name in tableSentenceMappings
          ? tableSentenceMappings[
              table_name as keyof typeof tableSentenceMappings
            ][operation]?.replace('$on', oldChanges['name']) ||
            'deleted an entry'
          : 'deleted an entry';

      break;
    }

    default:
      sentence = `Unknown action "${operation}" was performed by user ${createdby_name} on the "${table_name}" table.`;
      break;
  }

  return {
    sentence,
    action,
  };
};

const formattedChangelog = computed(() => {
  // @ts-expect-error it's not that deep
  return changelog.value.map(changelogEntry => {
    const formattedText = generateChangelogSentence(changelogEntry);

    return {
      ...changelogEntry,
      ...formattedText,
    };
  });
});
</script>

<template>
  <div class="flex justify-between">
    <ChangelogList class="max-h-svh h-fit mt-4">
      <ChangelogListItem
        v-for="(change, changelogIndex) in formattedChangelog"
        :key="changelogIndex"
        :avatar="change.createdby_profile_image_url"
        :actionBy="change.createdby_name || undefined"
        :time="change.created_at"
        :type="change.operation === 'UPDATE' ? 'comment' : 'default'"
        :action="change.action"
      >
        <div v-if="change.sentence" v-html="change.sentence"></div>
      </ChangelogListItem>
    </ChangelogList>
  </div>
</template>
