<template>
  <div>
    <div class="container-fluid mt-6">
      <div class="row">
        <div
          v-if="
            this.$auth.user.designation_category == 'new_client' ||
              $auth.user.designation_category == 'current_client' ||
              $auth.user.designation_category == 'affiliate_partner'
          "
          class="col-xl-12 order-xl-1"
        >
          <edit-client-profile-form></edit-client-profile-form>
        </div>
        <div v-else-if="this.$auth.user.designation_category == 'staff'"
          class="col-xl-12 order-xl-1">
          <edit-staff-profile-form></edit-staff-profile-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EditClientProfileForm from "~/components/pages/UserProfile/EditClientProfileForm.vue";
import EditStaffProfileForm from "~/components/pages/UserProfile/EditStaffProfileForm.vue";
import UserCard from "~/components/pages/UserProfile/UserCard.vue";
import ProgressTrackList from "~/components/widgets/ProgressTrackList.vue";

export default {
  layout: "DashboardLayout",
  components: {
    EditClientProfileForm,
    EditStaffProfileForm,
    UserCard,
    ProgressTrackList
  }
};
</script>
<style>
.profile-header {
  background-image: url(/~/static/img/theme/profile-cover.jpg);
  background-size: cover;
  background-position: center top;
  min-height: 500px;
}
</style>
