<script lang="ts">
    let {user} = $props();
</script>

<div class="max-w-5xl mx-auto">
    <h1>USER DASHBOARD</h1>
    <p>{user.id} {user.email} {user.role} {user.firstName} {user.lastName} {user.address} {user.phoneNumber}</p>
</div>