from django.core.exceptions import ObjectDoesNotExist

def load_model(model_class, pk):
    try:
        return model_class.objects.get(pk=pk)
    except ObjectDoesNotExist:
        raise model_class.DoesNotExist