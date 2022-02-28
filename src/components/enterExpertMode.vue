<template>
    <div class="modal fade"  ref="dialogref" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Enter expert mode</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body main">
            <div>
                To enter the expert mode please type in the password and press OK.
            </div>
            <div style="margin-top:5%;">
                <input type="password" class="form-control" v-model="password" ref="inputcontrol">
            </div>                   
        </div>
        <div class="modal-footer main">
            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" @click="switchToExpertMode">OK</button>
            <button type="cancel" class="btn btn-primary" data-bs-dismiss="modal">Cancel</button>
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
        setup(props, {emit})
        {
            const dialogref = ref();
            let dialog:any = undefined;
            let password = ref("");
            let inputcontrol = ref();
            let expertPassword = "master";

            //wait until the template was mounted, then the bootstrap Modal object will be created
            onMounted(()=>{
                dialog = new Modal(dialogref.value,{keyboard:false, backdrop:false});
                dialogref.value.addEventListener('shown.bs.modal', function () {
                    inputcontrol.value.focus();
                    });
            });
            
            watch( () => props.triggerShow,()=>{            
                dialog.show();                
            });

            const switchToExpertMode = ()=>{
                if(password.value === expertPassword)
                {
                    emit("expertModeActivated");
                }
                password.value = "";
            };

            return {dialogref, switchToExpertMode, password, inputcontrol};
        },
        
        props:{
            triggerShow:{
                type: Boolean,
                required: true
            }            
        },
        emits:["expertModeActivated"]    
    })
</script>

<style>
    .main{
        margin-left: 5%;
        margin-right: 5%;
        text-align: start;
    }

</style>