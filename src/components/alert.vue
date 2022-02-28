<template>
    <div class="modal fade"  ref="alertModalref" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{titel}}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
         {{message}}
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
        </div>
        </div>
    </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent,watch, ref, onMounted} from 'vue';
    import {Modal} from 'bootstrap';
    
    export default defineComponent({
        components: {},
        setup(props)
        {
            const alertModalref = ref();
            let alertModal:any = undefined;

            //wait until the template was mounted, then the bootstrap Modal object will be created
            onMounted(()=>{
                alertModal = new Modal(alertModalref.value);
            });
            
            watch( () => props.triggerShow,()=>{            
                alertModal.show();
            });

            return {alertModalref};
        },
        
        props:{
            triggerShow:{
                type: Boolean,
                required: true
            },
            titel:{
                type: String,
                required: true
            },
            message:{
                type: String,
                required: true
            }
        }
    
    })
</script>

<style>

</style>