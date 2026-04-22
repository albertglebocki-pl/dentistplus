<script lang="ts">
    let {data} = $props();
</script>

<div class="max-w-5xl mx-auto">
    <h1>DOCTOR DASHBOARD</h1>
    <p>
        {data.user.id}
        {data.user.email}
        {data.user.role}
        {data.user.firstName}
        {data.user.lastName}
        {data.user.address}
        {data.user.phoneNumber}
    </p>
</div>