from data.models import Device, Package, Snapshot, ChosenVersion

def tear_down_objects():
    """After each test function
    which flush database
    """
    Snapshot.objects.all().delete()
    ChosenVersion.objects.all().delete()
    Package.objects.all().delete()
    Device.objects.all().delete()
