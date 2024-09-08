from django.test import SimpleTestCase
from data.models import ObjectModel

class TestObjectModel(SimpleTestCase):
    """Template model test class
    """
    databases = '__all__'
    def setUp(self):
        """Setup for following test cases
        """
        self.test_object = ObjectModel.objects.create(name="Mon objet!")

    def test_object_id_is_one(self):
        """Check if primary key of created object is equal to 1
        """
        self.assertEqual(self.test_object.id,1)

    def test_object_name_is_correct(self):
        """Check if the object created in the method `setUp` has
        the correct name
        """
        self.assertEqual(self.test_object.name,"Mon objet!")

    def test_str_function_returns_name(self):
        """Check if the `__str__` function passed returns the correct value
        """
        self.assertEqual(str(self.test_object),"Mon objet!")

    def tearDown(self) -> None:
        """Tear down function
        """
        self.test_object.delete()
