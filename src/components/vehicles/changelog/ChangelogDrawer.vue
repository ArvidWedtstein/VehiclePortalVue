<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { calculateJsonChanges } from '@/utils/utils';
import type { Database, Tables } from '@/database.types';
import { useBreakpoints } from '@/lib/composables/useBreakpoints';
import MobileDrawer from '@/components/general/modal/MobileDrawer.vue';
import { storeToRefs } from 'pinia';
import { useChangelogStore } from '@/stores/changelog';
import ChangelogList from '@/components/general/changelog/ChangelogList.vue';
import ChangeLogListItemPlaceholder from '@/components/general/changelog/ChangeLogListItemPlaceholder.vue';
import ChangelogListItem from '@/components/general/changelog/ChangelogListItem.vue';

const { isMd } = useBreakpoints();
const drawerRef = ref<InstanceType<typeof MobileDrawer> | null>(null);

const changelogStore = useChangelogStore();

const { changelog, loading } = storeToRefs(changelogStore);
const { getChangelog } = changelogStore;

type TableNames = keyof Database[Extract<keyof Database, 'public'>]['Tables'];

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
      | 'Roles'
      | 'Profiles'
      | 'RolesPermissions'
      | 'VehicleManufacturers'
    >]: {
      INSERT?: string;
      UPDATE?: string;
      DELETE?: string;
    };
  } = {
    Vehicles: {
      INSERT: `Created a new vehicle`,
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

      //       .replace(
      //             'expense',
      //             `<a
      //   href="${newChanges['vehicle_id']}/expenses/${newChanges['id']}"
      //   class="font-semibold text-base-content text-nowrap"
      // >Expense</a>`,
      //           )

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
  return changelog.value.map(changelogEntry => {
    const formattedText = generateChangelogSentence(changelogEntry);

    return {
      ...changelogEntry,
      ...formattedText,
    };
  });
});

onBeforeMount(async () => {
  getChangelog();
});

defineExpose({
  drawerRef: drawerRef,
});
</script>

<template>
  <MobileDrawer
    ref="drawerRef"
    :direction="isMd ? 'left' : 'bottom'"
    title="Changelog"
  >
    <ChangelogList class="md:max-w-96">
      <template v-if="loading">
        <ChangeLogListItemPlaceholder v-for="i in 10" :key="i" />
      </template>
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
  </MobileDrawer>
</template>
